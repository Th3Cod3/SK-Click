<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model {
	use SoftDeletes;

	protected $dates = ['deleted_at'];
	protected $with = ['event_photobooths'];

	public function event_photobooths()
	{
		return $this->hasMany(Event_photobooth::class);
	}
}
