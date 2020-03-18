<?php 

namespace App\Controllers\System;

use App\Controllers\TwigController;
use App\Models\Division;
class DivisionController extends TwigController
{
	public function anyIndex(string $division_url)
	{
		$division = Division::where("url", $division_url)->firstOrFail();
		return $this->render("Division/division.twig", [
			'delnav' => true,
			"app_title" => $division["name"],
			"division" => $division->toArray(),
			"division_id" => $division->id
		]);
	}
}
?>