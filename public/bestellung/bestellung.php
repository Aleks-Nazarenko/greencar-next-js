<?php
// Moved from the old Joomla site (relaunch/) in 2026. The code below reads form fields that may be
// missing and variables that are only set when a field was filled in. On PHP 8 that raises warnings,
// so hide them; they must not end up in front of the thank-you page.
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');

$post = array();

foreach($_POST as $key=>$value ){

	
		if( false === mb_detect_encoding($key,'UTF-8',true) ){$key = mb_convert_encoding($key, "UTF-8"); } // setze ? statt umlaut
		if( false === mb_detect_encoding($value,'UTF-8',true) ){$value = mb_convert_encoding($value, 'UTF-8', 'ISO-8859-1'); } // funktioniert nur wenn $value ist  ISO-8859-1 encoded

		$post[$key] = $value; // soll unten  statt $_POST benutzt werden

}


/*
echo "<pre>";
print_r( $post );
echo "</pre>";

echo "<pre>";
print_r( $_POST );
echo "</pre>";

echo "<pre>";
print_r( $_REQUEST );
echo "</pre>";

echo "<pre>";
print_r($_FILES);
echo "</pre>";
//ÄÄ

*/




		if( $_POST['Firma']){ 
			$firma = 		"Firma: "." ".$_POST['Firma']."\r\n \r\n";
		} 
		
		if( $_POST['Ansprechpartner']){ 
			$partner	 =		"Ansprechpartner: "." ".$_POST['Ansprechpartner']."\r\n \r\n";
		
		} 
    
		if( $_POST['Strasse']){ 
				$strasse =    "Straße: "." ".$_POST['Strasse']."\r\n \r\n";  
		 } 

		if( $post['Stra?e']){ ///////////
				$strasse =    "Straße: "." ".$post['Stra?e']."\r\n \r\n"; ///////////////////// 
		 } 
		
		if( $_POST['PLZ']){ 
			 $plz	 = 		"PLZ: "." ".$_POST['PLZ']."\r\n \r\n"; 	
		}
    
		if( $_POST['Telefon']){ 
			$telefon	 = 	    "Telefon: "." " .$_POST['Telefon']."\r\n \r\n";
		} 
   	
		if( $_POST['E-Mail']){ 
			$email	 = 	   	"E-Mail: "." ".$_POST['E-Mail']."\r\n \r\n";
		} 
    
		if( $_POST['Referenznummer']){ 
			$r_nummer		 =     "Referenznummer: "." ".$_POST['Referenznummer']."\r\n \r\n";
		
		}  
    
		if( $_POST['Hinweis']){ 
			$fragen		 =     "Hinweis / Fragen offen: "." ".$_POST['Hinweis']."\r\n \r\n";
		} 
		
    if( $_POST['firma-abhol']){ 
			$firma_alt	 =     "Firma 2: "." ".$_POST['firma-abhol']."\r\n \r\n";
		} 
    
		if( $_POST['ansprechpartner-abhol']){ 
			$partner_alt		 =     "Ansprechpartner 2: "." ".$_POST['ansprechpartner-abhol']."\r\n \r\n";
		
		} 
    
		if( $_POST['strasse-abhol']){ 
			$strasse_alt	 = 	    "Straße 2: "." ".$_POST['strasse-abhol']."\r\n \r\n";
		
		} 		

    if( $_POST['plz-abhol']){ 
 			$plz_alt	 = 	    "PLZ 2: "." ".$_POST['plz-abhol']."\r\n \r\n";
		}		
    
		if( $_POST['telefon-abhol']){ 
			$telefon_alt	 = 	    "Telefon 2: "." ".$_POST['telefon-abhol']."\r\n \r\n";
		
		} 
    if( $_POST['e-mail-abhol']){ 
			$email_alt	 = 	    "E-Mail 2: "." ".$_POST['e-mail-abhol']."\r\n \r\n";
		
		} 			 				
		
    if( $_POST['Hersteller']){ 
			$hesteller	 = 	    "Hersteller: "." ".$_POST['Hersteller']."\r\n \r\n";		
		} 	
   	
		if( $_POST['Modell']){ 
			$modell	 = 	   	"Modell: "." "	.$_POST['Modell']."\r\n \r\n";
		} 
    
		if( $_POST['Turboladerschaden']){ 
				if($_POST['Turboladerschaden'] == 'Auswahl1'){ 
						$turbo = 'nein';
				}elseif($_POST['Turboladerschaden'] == 'Auswahl2'){
					$turbo = 'ja';
				
				}else{
					$turbo = $_POST['Turboladerschaden'];
				}
		
			$schaden =     "Turboladerschaden: "." ".$turbo."\r\n \r\n";
		
		} 
		
		
		if( $_POST['Abholdatum-Partikelfilter']){ 
				$datum  = 		"Abholdatum: "." ".$_POST['Abholdatum-Partikelfilter']."\r\n \r\n";
		}
		
    if( $_POST['Abholdatum-Partikelfilter-von']){ 
				$von		 =     "Abholzeit von: "." ".$_POST['Abholdatum-Partikelfilter-von']."\r\n \r\n";
		} 

    if( $_POST['Abholdatum-Partikelfilter-bis']){ 
			$bis		 = "Abholzeit bis: "." ".$_POST['Abholdatum-Partikelfilter-bis']."\r\n \r\n";
		
		}

    if( $_POST['Abholpreis']){ 
			$abholpreis		 =       "Abholpreis: "." ".$_POST['Abholpreis']."\r\n \r\n";  
		
		} 

    if( $_POST['Preis']){ 
			$preis =     "Preis: "." ".$_POST['Preis']."\r\n \r\n";
		
		}
		
$mesg = 			$firma . $partner	 .	$strasse . $plz	 . 	$telefon	 . 	$email	 . 	$r_nummer		 . 	$fragen		 . $firma_alt	 . 	$partner_alt		 . $strasse_alt	 . 	$plz_alt	 . 	$telefon_alt	 . 	$email_alt	 . 	$hesteller	 . 		$modell	 . 	$schaden . $datum  . $von		 . $bis		 . $abholpreis		 . $preis	;	
		
  $mailadresse = 'info@greencar.eu';
//	$mailadresse = 'nazarenko@gmx.de';
	$subject = 'tecdoc PDF-Formular';
//	$mesg = $feld1."\r\n \r\n".$feld2."\r\n \r\n".$feld3;
	$from = "From: info@greencar.eu \r\n". 'Content-Type:text/plain; charset="UTF-8"';
	
	
	$erfolg = mail($mailadresse, $subject, $mesg , $from);

	if($erfolg){
	
		echo'
		<!DOCTYPE html>
<html >
  <head>
	</head>
		<body>
		<div style="position:absolute; left:10%; top:5%">
		<h1 >Vielen Dank f&uuml;r Ihre Bestellung!</h1>
		<div style="font-weight:bold; font-size:22px; color:#3d3d3d; text-decoration:none">
		Sie werden umgehend eine Auftragsbest&auml;tigung sowie die entsprechenden Versandscheine erhalten. <br/>
		GREENCAR Automotive<br/>
		Zelterstr. 6<br/>
		10439 Berlin<br/>
		Tel: 030-417 22 08-8<br/>
		Fax: 030-417 22 08-1<br/>
		E-Mail: <a style="color:#3d3d3d; text-decoration:none" href="mailto:info@greencar.eu">info@greencar.eu</a><br/>
		<a style="color:#3d3d3d; text-decoration:none" href="http://www.greencar.eu" >www.greencar.eu</a>
		
		</div>
		
		</div>
		</body>
</html>
		';
	}else{
		echo"<h1>Ihre Email konnte nicht veschickt werden!</h1>";
	}


?>
