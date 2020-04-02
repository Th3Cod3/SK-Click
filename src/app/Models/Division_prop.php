<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Division_prop extends Model {
	use SoftDeletes;

	protected $dates = ['deleted_at'];
	protected $with = ['prop'];

	public function division()
	{
		return $this->belongsTo(Division::class);
	}

	public function prop()
	{
		return $this->belongsTo(Prop::class);
	}
}