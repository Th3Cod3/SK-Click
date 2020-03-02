<?php 

namespace App\Controllers\Api;

use App\Controllers\TwigController;
use App\Helpers\Event as EventHelper;
use App\Helpers\Login;
use App\Models\Division;
use App\Models\Event;
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
				if($_POST["ajax"] == "new"){
					$division->name = $_POST["name"];
					$division->description = $_POST["description"];
					$division->url = urlencode(preg_replace("/ /", "_", trim(preg_replace("/[!*':;#@&=\^%\+,\$\[\]\?\(\)]/", "", $_POST["name"]))));
				}
				try {
					$save = $division->save();
					$division = $division->toArray();
				} catch (\Throwable $th) {
					if($th->code == 23000){
						$validator->addMessage('error','This event already exist');
					}
				}
			}
		}elseif(isset($_GET["ajax"]) && $_GET["ajax"]){
			$html = $this->render("Division/division-form.twig");
		}
		
		$result = json_encode(["html" => $html ?? null, "save" => $save ?? null, "division" => $division ?? null]);
		return $result;
	}

	
	public function postEvents()
	{
		$events = Event::where("division_id", $_POST["division_id"])->orderBy("from_date")->get()->toArray();
		$result = json_encode(["events" => $events]);
		return $result;
	}

	public function anyEvent()
	{
		if(isset($_POST["ajax"]) && $_POST["ajax"]){
			$validator = new Validator;
			$event = new Event;
			if($validator->validate($_POST)){
				if($_POST["ajax"] == "new"){
					$event->name = $_POST["name"];
					$event->ref_num = EventHelper::createRef_num();
					$event->division_id = $_POST["division_id"];
					$event->venue = $_POST["venue"];
					$event->usb = $_POST["usb"] ?? 0;
					$event->printing = $_POST["printing"] ?? 0;
					$event->from_date = $_POST["from_date"];
					$event->to_date = $_POST["to_date"];
				}
				$save = $event->save();
				$event = $event->toArray();
			}
		}elseif(isset($_GET["ajax"]) && $_GET["ajax"]){
			$html = $this->render("Event/event-form.twig", [
				"division_id" => $_GET["division_id"]
			]);
		}
		
		$result = json_encode(["html" => $html ?? null, "save" => $save ?? null, "event" => $event ?? null]);
		return $result;
	}
}
