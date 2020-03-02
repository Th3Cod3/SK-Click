<?php

namespace App\Helpers;

use App\Models\User;

class Permission{

	public static function checkAuth() {
		if (isset($_COOKIE['username']) || (isset($_SESSION["username"]) && $_SESSION["username"])) {
			if(!isset($_COOKIE["APP_ID"]) || !isset($_COOKIE["username"]) || $_COOKIE["APP_ID"] != $_SESSION["token"]){
				setcookie("APP_ID", $_SESSION["token"], time() + COOKIE_TIMEOUT*60);
				setcookie("username", $_SESSION["username"], time() + COOKIE_TIMEOUT*60);
				$_COOKIE["APP_ID"] = $_SESSION["token"];
				$_COOKIE["username"] = $_SESSION["username"];
			}
			$user = User::where("username", $_COOKIE['username'])->first();
			$minuteAgoFromLastActivity = (time() - strtotime($user['last_activity'])) / 60;
			if (!isset($_COOKIE['username']) || $user['banned'] == 1 || $minuteAgoFromLastActivity > SESSION_TIMEOUT ||  $_COOKIE['APP_ID'] != $user['token']) {
				header('Location: ' . BASE_URL . 'logout');
				return false;
			}
			if (!isset($_SESSION['user_id']) && $_COOKIE['APP_ID'] === $user['token'] && $minuteAgoFromLastActivity < SESSION_TIMEOUT && !$user['banned']) {
				$_SESSION['user_id'] = $user->id;
				$_SESSION['username'] = $user->username;
			}
			if (isset($_SESSION['user_id'])){
				$user->last_activity = date('Y-m-d H:i:s');
				$user->save();
			}
	
			if(!preg_match("/^ajax\/.*/", $_GET["route"])){
				// $_SESSION['rol'] = $UsersModel->getRol($user['permission']); TODO: ROL
			}
		} else {
			header('Location: ' . BASE_URL . 'logout');
			return false;
		}
	}

}