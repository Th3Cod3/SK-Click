<?php

namespace App\Helpers;

use App\Models\Event as EventModel;

class Event{

	static function createRef_num()
	{
		$last_event = EventModel::where("ref_num", "like", date("yW/N-")."%")->orderBy("ref_num", "desc")->first();
		if($last_event){
			$lastRef = substr($last_event['ref_num'], -2,2);
			$num = $lastRef+1;
			return date("yW/N-").str_pad($num, 2, "0", STR_PAD_LEFT);
		}else{
			return date("yW/N-").'01';
		}
	}
}