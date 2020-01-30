<?php 

namespace App\Controllers;


class TwigController {

	protected $twigEng;

	public function __construct()
	{
		$loader = new \Twig\Loader\FilesystemLoader('views');
		$this->twigEng = new \Twig\Environment($loader,[
			'debug' => true, 
			'cache' => false
		]);

		//for the dump function of TWIG
		$this->twigEng->addExtension(new \Twig\Extension\DebugExtension());

		$this->twigEng->addFilter(new \Twig\TwigFilter('_ENV', function($env){
				return $_ENV[$env];
		}));

		$this->twigEng->addFilter(new \Twig\TwigFilter('url', function($path){
				return BASE_URL.$path;
		}));
	}

	public function render($fileName, $data = [])
	{
			return $this->twigEng->render($fileName,$data);
	}

}


?>