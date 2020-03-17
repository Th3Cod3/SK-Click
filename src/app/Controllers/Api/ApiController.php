<?php

namespace App\Controllers\Api;

use App\Controllers\TwigController;
use App\Helpers\Event as EventHelper;
use App\Helpers\Login;
use App\Models\Booth_type;
use App\Models\Backdrop;
use App\Models\Prop;
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

	public function postProps()
	{
		$props = Prop::all()->toArray();
		$result = json_encode(["props" => $props]);
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
					$prop->name = $_POST["name"];
					// TODO pending to implement image upload
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
		$result = json_encode(["html" => $html ?? null, "save" => $save ?? null, "prop" => $prop ?? null, "error" => $error ?? null]);
		return $result;
	}

	public function postBackdrops()
	{
		$backdrops = Backdrop::all()->toArray();
		$result = json_encode(["backdrops" => $backdrops]);
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
					$backdrop->name = $_POST["name"];
					// TODO pending to implement image upload
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
		$result = json_encode(["html" => $html ?? null, "save" => $save ?? null, "backdrop" => $backdrop ?? null, "error" => $error ?? null]);
		return $result;
	}

	public function postBooth_types()
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
					$booth_type->name = $_POST["name"];
					// TODO pending to implement image upload
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
		$result = json_encode(["html" => $html ?? null, "save" => $save ?? null, "booth_type" => $booth_type ?? null, "error" => $error ?? null]);
		return $result;
	}

	public function postDivisions()
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
		$result = json_encode(["html" => $html ?? null, "save" => $save ?? null, "division" => $division ?? null, "error" => $error ?? null]);
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
		if (isset($_POST["ajax"]) && $_POST["ajax"]) {
			$validator = new Validator;
			$event = new Event;
			$validator->add("name", "required");
			$validator->add("venue", "required");
			$validator->add("from_date", "required | datetime");
			$validator->add("to_date", "required | datetime");
			if ($validator->validate($_POST)) {
				if ($_POST["ajax"] == "new") {
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
			$error = $validator->getMessages();
		}
		$result = json_encode(["html" => $html ?? null, "save" => $save ?? null, "event" => $event ?? null, "error" => $error ?? null]);
		return $result;
	}
}
