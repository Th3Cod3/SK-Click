<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booth_type extends Model {
	use SoftDeletes;

	protected $dates = ['deleted_at'];

}