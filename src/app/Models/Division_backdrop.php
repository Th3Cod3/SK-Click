<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Division_backdrop extends Model {
	use SoftDeletes;

	protected $dates = ['deleted_at'];
	protected $with = ['backdrop'];

	public function division()
	{
		return $this->belongsTo(Division::class);
	}

	public function backdrop()
	{
		return $this->belongsTo(Backdrop::class);
	}
}