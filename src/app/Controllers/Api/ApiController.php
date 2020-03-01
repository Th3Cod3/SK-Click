<?php 

namespace App\Controllers\Api;

use App\Controllers\TwigController;
use App\Helpers\Login;
use App\Models\Division;
use Sirius\Validation\Validator;

class ApiController extends TwigController
{
	public function postLogin()
	{
		$login = new Login;
		return $login->authenticate();
	}

	public function postDivisions()
	{
		$divisions = Division::all()->toArray();
		$result = json_encode(["divisions" => $divisions]);
		return $result;
	}

	public function anyDivision()
	{
		if(isset($_POST["ajax"]) && $_POST["ajax"]){
			$validator = new Validator;
			$division = new Division;
			if($validator->validate($_POST)){
				$division->name = $_POST["name"];
				$division->description = $_POST["description"];
				$division->url = urlencode(preg_replace("/ /", "_", trim(preg_replace("/[!*':;#@&=\^%\+,\$\[\]\?\(\)]/", "", $_POST["name"]))));
				try {
					$result = $division->save();
				} catch (\Throwable $th) {
					if($th->code == 23000){
						$validator->addMessage('kvk_no','exist');
					}
				}
			}
		}elseif(isset($_GET["ajax"]) && $_GET["ajax"]){
			$html = $this->render("Division/division-form.twig");
		}
		$result = json_encode(["html" => $html ?? null, "save" => $save ?? null]);
		return $result;
	}
}
