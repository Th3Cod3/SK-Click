<?php 

namespace App\Controllers\Api;

use App\Helpers\Login;

class ApiController
{
	public function postLogin()
	{
		$login = new Login;
		return $login->authenticate();
	}
}

?>