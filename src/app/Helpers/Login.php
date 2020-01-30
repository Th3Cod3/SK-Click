<?php

namespace App\Helpers;

use Sirius\Validation\Validator;
use App\Models\User;

class Login{

	private $User;
	public static function checkSession()
	{
		if(isset($_SESSION['username'])){
			return 1;
		}else{
			return 0;
		}
	}

	public function authenticate()
	{
		$validator = new Validator();
		$validator->add('username', 'required');
		$validator->add('password', 'required');

		if($validator->validate($_POST)){
			$this->User = User::where("username",$_POST['username'])->first();
			if($this->User){
				$minuteAgo = (strtotime("now") - strtotime($this->User['first_fail_password']))/60;
				if($minuteAgo < USER_LOCK_TIME && $this->User['fail_counter'] >= 10){
					$validator->addMessage('Error','User lock, try again later');
					$errors = $validator->getMessages();
					return json_encode(["login" => false, "errors" => $errors]);
					// password_verify($_POST['password'], $this->User['password'])
				}elseif($_POST['password'] === $this->User['password']){
					if($this->User['banned'] == 1){
						$validator->addMessage('Error','You are banned');
						$errors = $validator->getMessages();
						return json_encode(["login" => false, "errors" => $errors]);
					}else{
						$token = bin2hex(openssl_random_pseudo_bytes(64));
						$this->User["token"] = $_SESSION["token"] = $token;
						$_SESSION["username"] = $this->User["username"];
						$this->User["last_login"] = date('Y-m-d H:i:s');
						$this->User["last_activity"] = date('Y-m-d H:i:s');
						$this->User->save();
						return json_encode(["login" => true, "url" => BASE_URL."home"]);
					}
				}
			}
			$this->failLogin($validator, "user");
		}
		$errors = $validator->getMessages();
		return json_encode(["login" => false, "errors" => $errors]);
	}

	private function failLogin($validator, $case)
	{
		switch ($case) {
			case 'user':
			case 'password':
				$validator->addMessage('Error','Username and/or password does not match');
				$this->updateTrialSession();
				break;
			
			default:
				$validator->addMessage('Error','Contact admin');
				break;
		}
	}

	private function updateTrialSession()
	{
		if($this->User){
			if($this->User['first_fail_password'])
				$minutesAgo = (strtotime("now") - strtotime($this->User['first_fail_password']))/1000/60/60;

			if($minutesAgo < USER_LOCK_TIME){
				$this->User["fail_counter"]++;
			}else{
				$this->User["fail_counter"] = 1;
				$this->User["first_fail_password"] = date('Y-m-d H:i:s');
			}
		}else{
			// save ip if fail 10 times add to blacklist
		}
		$this->User->save();
	}
}