<?php 

namespace App\Controllers\System;

use App\Controllers\TwigController;
use App\Models\Division;

class ManageController extends TwigController
{
	public function anyIndex(string $division_url)
	{
		$division = Division::where("url", $division_url)->firstOrFail();
		return $this->render("Manage/manage.twig", [
			"app_title" => $division["name"],
			"division" => $division->toArray()
		]);
	}
}
?>