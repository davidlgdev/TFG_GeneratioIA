<?php
defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/question/format.php');
require_once($CFG->libdir . '/externallib.php');
require_once($CFG->dirroot . '/question/engine/bank.php');

class local_qbank_plugin_external extends external_api {

    public static function add_question($param_string) {
        global $DB, $CFG;

        
        $param_array = preg_split('/--/', $param_string); // Separar los parametros

        $categoryid = intval($param_array[0]); // ID de categoría de preguntas
        $courseid = intval($param_array[1]);  // ID del curso
        $format = $param_array[2];            // Formato de la pregunta
        $questionsdata = $param_array[3];     // Datos de las preguntas

        if (!$category = $DB->get_record('question_categories', ['id' => $categoryid])) {
            throw new invalid_parameter_exception("Categoría con ID {$categoryid} no encontrada.");
        }
        if (!$course = $DB->get_record('course', ['id' => $courseid])) {
            throw new invalid_parameter_exception("Curso con ID {$courseid} no encontrado.");
        }

        // Validar contexto
        $context = context::instance_by_id($category->contextid);
        if (!$context) {
            throw new invalid_parameter_exception("El contextid {$category->contextid} no es válido.");
        }
        if (!in_array($context->contextlevel, [CONTEXT_COURSE, CONTEXT_COURSECAT])) {
            throw new invalid_parameter_exception("El contextlevel del contexto {$category->contextid} no es válido. Se esperaba CONTEXT_COURSE o CONTEXT_COURSECAT.");
        }

        // Validar permisos del usuario
        self::validate_context($context);
        require_capability('moodle/question:add', $context);

        $associated_courseid = null;
        if ($context->contextlevel === CONTEXT_COURSE) { // Es solo para un curso
            $associated_courseid = $context->instanceid;
        } elseif ($context->contextlevel === CONTEXT_COURSECAT) { // Es para una categoría de cursos
            $associated_courseid = $DB->get_field('course', 'id', ['category' => $context->instanceid], IGNORE_MULTIPLE);
        } else {
            // Contextlevel invalido.
            throw new invalid_parameter_exception("El contextlevel del contexto {$context->id} no es válido. Se esperaba CONTEXT_COURSE o CONTEXT_COURSECAT.");
        }
        //No existe un curso
        if (!$associated_courseid) {
            throw new invalid_parameter_exception("No se pudo determinar un curso para este contexto.");
        }
        
        // Verificar formato para importar
        $formatfile = $CFG->dirroot . "/question/format/{$format}/format.php";
        if (!file_exists($formatfile)) {
            throw new invalid_parameter_exception("Formato de importación no existe: {$format}");
        }
        //Directorio de archivos temporales de XAMPP
        $xampp_temp = "E:/Programas/xampp/tmp/";
        //Se crea un archivo temporal para guardar las preguntas
        $timestamp = time();
        $random = uniqid();
        $tempfile = $xampp_temp . "qimport_{$timestamp}_{$random}.gift";
        if (file_put_contents($tempfile, $questionsdata) === false) {
            throw new Exception('Error al escribir el fichero temporal: ' . error_get_last()['message']);
        }
        // Se instancia una clase del formato
        require_once($formatfile);  
        $classname = "qformat_{$format}";
        $qformat = new $classname();
        $qformat->setCategory($category);
        $qformat->setContexts($context->contextlevel);
        $qformat->setCourse($associated_courseid);
        $qformat->setFilename($tempfile);
        // Se procesan las preguntas
        if ($qformat->importpreprocess() && $qformat->importprocess() && $qformat->importpostprocess()) {
            unlink($tempfile);
            return true;
        } else {
            $error = $qformat->get_error(); // Obtener el mensaje de error
            throw new moodle_exception('Error al importar preguntas: ' . $error);
        }
         // Delete the temporary file after import

    }

    public static function execute_parameters() {
        return new external_function_parameters(
            array(
                'params' => new external_value(PARAM_RAW, 'Parámetros con "--" como separador'),
            )
        );
    }

    public static function execute_returns() {
        return new external_value(PARAM_BOOL, 'True si la importación es correcta');
    }

    public static function execute($params) {
        return self::add_question($params); 
    }
}
