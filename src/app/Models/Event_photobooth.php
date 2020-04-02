<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event_photobooth extends Model {
	use SoftDeletes;

	protected $dates = ['deleted_at'];
	protected $with = ['division_backdrop', 'photobooth'];

	public function event()
	{
		return $this->belongsTo(Event::class);
	}

	public function photobooth()
	{
		return $this->belongsTo(Photobooth::class);
	}

	public function division_backdrop()
	{
		return $this->belongsTo(Division_backdrop::class);
	}

	public function division_props()
	{
		return $this->hasMany(Event_prop::class);
	}
}
