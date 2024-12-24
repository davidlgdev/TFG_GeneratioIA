<?php
defined('MOODLE_INTERNAL') || die();

$functions = [
    'local_qbank_plugin_add_question' => [
        'classname'   => 'local_qbank_plugin_external',
        'description' => 'Importar preguntas al banco de preguntas de Moodle',
        'classpath'   => 'local/qbank_plugin/externallib.php',
        'type'        => 'write',
        'capabilities' => 'moodle/question:add',
        'ajax'        => true,
    ],
];

$services = [
    'mi_webservice' => [
        'functions' => ['local_qbank_plugin_add_question'],
        'restrictedusers' => 0,
        'enabled' => 1,
    ],
];
