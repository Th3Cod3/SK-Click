<?php 

namespace App\Controllers;

use App\Helpers\Login;

class IndexController extends TwigController
{
	public function getIndex()
	{
		header("Location:".BASE_URL."login");
	}

	public function getLogin()
	{
		if(Login::checkSession())
			header('Location:'.BASE_URL.'home/');

		return $this->render('login.twig', [
			'delnav' => true,
			"app_title" => "Inloggen"
		]);
	}

		public function getLogout()
	{
		session_destroy();
		setcookie($_COOKIE["username"], "", time()-3600);
		setcookie($_COOKIE["APP_ID"], "", time()-3600);
		header("Location:".BASE_URL."login");
	}
	
}

?>