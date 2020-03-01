<?php 

namespace App\Controllers\System;

use App\Controllers\TwigController;

class HomeController extends TwigController
{
	public function anyIndex()
	{
		return $this->render("Home/home.twig", [
			'delnav' => true,
			"app_title" => "Home"
		]);
	}
}
?>