<?php

namespace App\Helpers;

use App\Models\File;

class Upload{

	public static function saveFile($file, $folderName, $extraInfo = [])
	{
		if($file['error'] > 0)
			return false;
		else{
			$fileModel = new File;
			$uploadDir = "uploads/$folderName";
			$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
			$filename = strtotime("now").'.'.$ext;

			if(!file_exists($uploadDir)){
				mkdir($uploadDir, 0777, 1);
			}
			$openDir = opendir($uploadDir);
			$fileDir = $uploadDir.'/'.$filename;

			closedir($openDir);

			if(move_uploaded_file($file['tmp_name'], $fileDir)){
				$fileModel->location = "$uploadDir/$filename";
				$fileModel->type = $file['type'];
				$fileModel->extension = ".$ext";
				$fileModel->client_name = $file['name'];
				$fileModel->description = $extraInfo['description'] ?? "";
				$fileModel->size = $file['size'];
				$fileModel->name = $extraInfo['name'] ?? str_replace(".$ext", "", $file['name']);
				$fileModel->save();
				return $fileModel;
			}else{
				return false;
			}
		}
	}
}