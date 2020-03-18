<?php

require_once "vendor/autoload.php";
session_start();

$baseDir = str_replace(basename($_SERVER['SCRIPT_NAME']), '', $_SERVER['SCRIPT_NAME']);
$protocol = isset($_SERVER['HTTPS']) ? 'https://' : 'http://';
$baseUrl = $protocol.$_SERVER['HTTP_HOST'].$baseDir;
$version = "v0.0.0";
$_ENV['APP_VERSION'] = $version;
//CONST
define('DAYS_OF_YEAR', 365.25);
define('ADMIN_ROL_ID', 1);
define('APP_VERSION', $version);
define('BASE_URL', $baseUrl);
define('USER_LOCK_TIME', 15); // time in minute
define('SESSION_TIMEOUT', 30); // time in minute
define('COOKIE_TIMEOUT', 60 * 24 * 7); // time in minute

use App\Helpers\Permission;
use Phroute\Phroute\RouteCollector;
use Phroute\Phroute\Exception\HttpRouteNotFoundException;
use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;

$dotenv = Dotenv::create(__DIR__);
$dotenv->load();
require 'config.php';
$capsule = new Capsule;

$capsule->addConnection([
    'driver'    => 'mysql',
    'host'      => $_ENV['DB_HOST'],
    'database'  => $_ENV['DB_NAME'],
    'username'  => $_ENV['DB_USER'],
    'password'  => $_ENV['DB_PASS'],
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
]);
$capsule->bootEloquent();

$route = $_GET['route'] ?? '/';


$router = new RouteCollector();

$router->filter('auth', function () {
	Permission::checkAuth();
});

$router->filter('api', function () {
	// API permissions
});


$router->group(['before' => 'auth'], function ($router) {
	$router->controller('home', App\Controllers\System\HomeController::class);
	$router->controller('division', App\Controllers\System\DivisionController::class);
	$router->controller('dashboard', App\Controllers\System\DashboardController::class);
});
$router->group(['before' => 'api'], function ($router) {
	$router->controller('api', App\Controllers\Api\ApiController::class);
});
$router->controller('/', App\Controllers\IndexController::class);

try {
	$dispatcher = new Phroute\Phroute\Dispatcher($router->getData());
	$response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], $route);
	echo $response;
} catch (HttpRouteNotFoundException $e) {
	if (isset($_SESSION['username'])) header('Location: ' . BASE_URL . 'home');
	else header('Location: ' . BASE_URL . 'login');
}
