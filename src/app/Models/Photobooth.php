<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Photobooth extends Model {
	use SoftDeletes;

	protected $dates = ['deleted_at'];
	protected $with = ['booth_type'];

	public function division()
	{
		return $this->belongsTo(Division::class);
	}

	public function booth_type()
	{
		return $this->belongsTo(Booth_type::class);
	}
}