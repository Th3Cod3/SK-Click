<?php

namespace App\Controllers\Api;

use App\Controllers\TwigController;
use App\Helpers\Event as EventHelper;
use App\Helpers\Login;
use App\Helpers\Upload;
use App\Models\Booth_type;
use App\Models\Backdrop;
use App\Models\Prop;
use App\Models\Division;
use App\Models\Division_backdrop;
use App\Models\Division_prop;
use App\Models\Event;
use App\Models\Event_photobooth;
use App\Models\Photobooth;
use Sirius\Validation\Validator;

class ApiController extends TwigController
{
	public function postLogin()
	{
		$login = new Login;
		return $login->authenticate();
	}

	public function getProps()
	{
		$props = Prop::all()->toArray();
		$result = json_encode(["props" => $props]);
		return $result;
	}

	public function getDivision_props()
	{
		$props = Division_prop::where("division_id", $_GET["division_id"])->get()->toArray();
		$result = json_encode(["props" => $props]);
		return $result;
	}

	public function anyDivision_prop()
	{
		if (isset($_POST["ajax"]) && $_POST["ajax"]) {
			$validator = new Validator;
			$prop = new Division_prop;
			$validator->add("prop_id", "required");
			$validator->add("division_id", "required");
			if ($validator->validate($_POST)) {
				if ($_POST["ajax"] == "new") {
					$prop->prop_id = $_POST["prop_id"];
					$prop->division_id = $_POST["division_id"];
				}
				$save = $prop->save();
				$prop = $prop->load("prop")->toArray();
			}
			$error = $validator->getMessages();
		}
		$result = json_encode(["save" => $save ?? null, "prop" => $prop ?? null, "error" => $error ?? null]);
		return $result;
	}

	public function anyProp()
	{
		if (isset($_POST["ajax"]) && $_POST["ajax"]) {
			$validator = new Validator;
			$prop = new Prop;
			$validator->add("name", "required");
			if ($validator->validate($_POST)) {
				if ($_POST["ajax"] == "new") {
					$file = Upload::saveFile(
						$_FILES["image"],
						"backdrops",
						[ "description" => "Image of the backdrop {$_POST['name']}" ]
					);
					$prop->name = $_POST["name"];
					$prop->image = $file->id;
					$prop->image_location = $file->location;
				}
				try {
					$save = $prop->save();
					$prop = $prop->toArray();
				} catch (\Throwable $th) {
					if ($th->getCode() == 23000) {
						$validator->addMessage('Duplicated:', 'This prop already exist');
					}
				}
			}
			$error = $validator->getMessages();
		}
		$result = json_encode(["save" => $save ?? null, "prop" => $prop ?? null, "error" => $error ?? null]);
		return $result;
	}

	public function getBackdrops()
	{
		$backdrops = Backdrop::all()->toArray();
		$result = json_encode(["backdrops" => $backdrops]);
		return $result;
	}

	public function getDivision_backdrops()
	{
		$backdrops = Division_backdrop::where("division_id", $_GET["division_id"])->get()->toArray();
		$result = json_encode(["backdrops" => $backdrops]);
		return $result;
	}

	public function anyDivision_backdrop()
	{
		if (isset($_POST["ajax"]) && $_POST["ajax"]) {
			$validator = new Validator;
			$backdrop = new Division_backdrop;
			$validator->add("backdrop_id", "required");
			$validator->add("division_id", "required");
			if ($validator->validate($_POST)) {
				if ($_POST["ajax"] == "new") {
					$backdrop->backdrop_id = $_POST["backdrop_id"];
					$backdrop->division_id = $_POST["division_id"];
				}
				$save = $backdrop->save();
				$backdrop = $backdrop->load("backdrop")->toArray();
			}
			$error = $validator->getMessages();
		}
		$result = json_encode(["save" => $save ?? null, "backdrop" => $backdrop ?? null, "error" => $error ?? null]);
		return $result;
	}

	public function anyBackdrop()
	{
		if (isset($_POST["ajax"]) && $_POST["ajax"]) {
			$validator = new Validator;
			$backdrop = new Backdrop;
			$validator->add("name", "required");
			if ($validator->validate($_POST)) {
				if ($_POST["ajax"] == "new") {
					$file = Upload::saveFile(
						$_FILES["image"],
						"backdrops",
						[ "description" => "Image of the backdrop {$_POST['name']}" ]
					);
					$backdrop->name = $_POST["name"];
					$backdrop->image = $file->id;
					$backdrop->image_location = $file->location;
				}
				try {
					$save = $backdrop->save();
					$backdrop = $backdrop->toArray();
				} catch (\Throwable $th) {
					if ($th->getCode() == 23000) {
						$validator->addMessage('Duplicated:', 'This backdrop already exist');
					}
				}
			}
			$error = $validator->getMessages();
		}
		$result = json_encode(["save" => $save ?? null, "backdrop" => $backdrop ?? null, "error" => $error ?? null]);
		return $result;
	}

	public function getPhotobooths()
	{
		if(isset($_GET["division_id"])){
			$photobooths = Photobooth::where("division_id", $_GET["division_id"])->get()->toArray();
		}else{
			
		}

		$result = json_encode([
			"photobooths" => $photobooths ?? [],
			"error" => $error ?? null
		]);
		return $result;
	}

	public function anyPhotobooth()
	{
		if (isset($_POST["ajax"]) && $_POST["ajax"]) {
			$validator = new Validator;
			$photobooth = new Photobooth;
			$validator->add("name", "required");
			$validator->add("division_id", "required");
			$validator->add("booth_type_id", "required");
			if ($validator->validate($_POST)) {
				if ($_POST["ajax"] == "new") {
					$photobooth->name = $_POST["name"];
					$photobooth->division_id = $_POST["division_id"];
					$photobooth->booth_type_id = $_POST["booth_type_id"];
				}
				try {
					$save = $photobooth->save();
					$photobooth = $photobooth->load("booth_type")->toArray();
				} catch (\Throwable $th) {
					if ($th->getCode() == 23000) {
						$validator->addMessage('Duplicated:', 'This photobooth already exist');
					}
				}
			}
			$error = $validator->getMessages();
		}
		$result = json_encode(["save" => $save ?? null, "photobooth" => $photobooth ?? null, "error" => $error ?? null]);
		return $result;
	}

	public function getBooth_types()
	{
		$booth_types = Booth_type::all()->toArray();
		$result = json_encode(["booth_types" => $booth_types]);
		return $result;
	}

	public function anyBooth_type()
	{
		if (isset($_POST["ajax"]) && $_POST["ajax"]) {
			$validator = new Validator;
			$booth_type = new Booth_type;
			$validator->add("name", "required");
			if ($validator->validate($_POST)) {
				if ($_POST["ajax"] == "new") {
					$file = Upload::saveFile(
						$_FILES["image"],
						"backdrops",
						[ "description" => "Image of the backdrop {$_POST['name']}" ]
					);
					$booth_type->name = $_POST["name"];
					$booth_type->image = $file->id;
					$booth_type->image_location = $file->location;
				}
				try {
					$save = $booth_type->save();
					$booth_type = $booth_type->toArray();
				} catch (\Throwable $th) {
					if ($th->getCode() == 23000) {
						$validator->addMessage('Duplicated:', 'This photobooth already exist');
					}
				}
			}
			$error = $validator->getMessages();
		}
		$result = json_encode(["save" => $save ?? null, "booth_type" => $booth_type ?? null, "error" => $error ?? null]);
		return $result;
	}

	public function getDivisions()
	{
		$divisions = Division::all()->toArray();
		$result = json_encode(["divisions" => $divisions]);
		return $result;
	}

	public function anyDivision()
	{
		if (isset($_POST["ajax"]) && $_POST["ajax"]) {
			$validator = new Validator;
			$division = new Division;
			$validator->add("name", "required");
			if ($validator->validate($_POST)) {
				if ($_POST["ajax"] == "new") {
					$division->name = $_POST["name"];
					$division->description = $_POST["description"];
					$division->url = urlencode(preg_replace("/ /", "_", trim(preg_replace("/[!*':;#@&=\^%\+,\$\[\]\?\(\)]/", "", $_POST["name"]))));
				}
				try {
					$save = $division->save();
					$division = $division->toArray();
				} catch (\Throwable $th) {
					if ($th->getCode() == 23000) {
						$validator->addMessage('Duplicated:', 'This event already exist');
					}
				}
			}
			$error = $validator->getMessages();
		}
		$result = json_encode(["save" => $save ?? null, "division" => $division ?? null, "error" => $error ?? null]);
		return $result;
	}

	public function getEvents()
	{
		$events = Event::where("division_id", $_GET["division_id"])->orderBy("from_date")->get()->toArray();
		$result = json_encode(["events" => $events]);
		return $result;
	}

	public function postEvent()
	{
		if (isset($_POST["ajax"]) && $_POST["ajax"]) {
			$validator = new Validator;
			$event = new Event;
			$photobooths = [];
			$_POST["from_date"] = str_replace("T", " ", $_POST["from_date"]);
			$_POST["to_date"] = str_replace("T", " ", $_POST["to_date"]);
			$validator->add("name", "required");
			$validator->add("venue", "required");
			$validator->add("from_date", "required");
			$validator->add("to_date", "required");
			if ($validator->validate($_POST)) {
				if ($_POST["ajax"] == "new") {
					$event->name = $_POST["name"];
					$event->ref_num = EventHelper::createRef_num();
					$event->division_id = $_POST["division_id"];
					$event->venue = $_POST["venue"];
					$event->usb = $_POST["usb"] === "true" ? 1:0;
					$event->printing = $_POST["printing"] === "true" ? 1:0;
					$event->from_date = $_POST["from_date"];
					$event->to_date = $_POST["to_date"];
					foreach ($_POST["photobooths"] as $key => $booth) {
						$photobooths[$key] = new Event_photobooth;
						$photobooths[$key]->photobooth_id = $booth["photobooth"]["id"];
						$photobooths[$key]->division_backdrop_id = $booth["backdrop"];
						$photobooths[$key]->touch_to_start = $booth["touch_to_start"] === "true" ? 1:0;
						$photobooths[$key]->photo_layer = $booth["photo_layer"] === "true" ? 1:0;
					}
				}
				$save = $event->save();
				if($save){
					foreach ($photobooths as $key => $booth) {
						$booth->event_id = $event->id;
						$booth->save();
					}
				}
				$event = $event->load("event_photobooths")->toArray();
			}
			$error = $validator->getMessages();
		}
		$result = json_encode(["save" => $save ?? null, "event" => $event ?? null, "error" => $error ?? null]);
		return $result;
	}
}
