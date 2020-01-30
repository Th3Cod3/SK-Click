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
			$userInfo = User::where("username", $_COOKIE['username'])->first();
			$minuteAgoFromLastActivity = (time() - strtotime($userInfo['last_activity'])) / 60;
			if (!isset($_COOKIE['username']) || $userInfo['banned'] == 1 || $minuteAgoFromLastActivity > SESSION_TIMEOUT ||  $_COOKIE['APP_ID'] != $userInfo['token']) {
				header('Location: ' . BASE_URL . 'logout');
				return false;
			}
			if (!isset($_SESSION['user_id']) && $_COOKIE['APP_ID'] === $userInfo['token'] && $minuteAgoFromLastActivity < SESSION_TIMEOUT && !$userInfo['banned']) {
				$_SESSION['user_id'] = $userInfo['user_id'];
				$_SESSION['username'] = $userInfo['username'];
				$_SESSION['firstname'] = $userInfo['firstname'];
				$_SESSION['lastname'] = $userInfo['lastname'];
				$_SESSION['gender'] = $userInfo['gender'];
				$_SESSION['person_id'] = $userInfo['person_id'];
			}
			if (isset($_SESSION['user_id'])) $UsersModel->updateUserActivity($_SESSION['user_id']);
	
			if(!preg_match("/^ajax\/.*/", $_GET["route"])){
				// $_SESSION['rol'] = $UsersModel->getRol($userInfo['permission']); TODO: ROL
			}
		} else {
			header('Location: ' . BASE_URL . 'logout');
			return false;
		}
	}

}