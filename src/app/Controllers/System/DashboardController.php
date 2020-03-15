<?php 

namespace App\Controllers\System;

use App\Controllers\TwigController;

class DashboardController extends TwigController
{
	public function anyIndex()
	{
		return $this->render("Dashboard/dashboard.twig", [
			'delnav' => true,
			"app_title" => "Home"
		]);
	}
}
?>