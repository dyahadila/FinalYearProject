<?php
	@$dbcnx = new mysqli('localhost', 'root', '', 'test');
	if(mysqli_connect_errno()){
		echo 'Error: could not connect to database.Please try again later.';
		exit;
		}
	if(!$dbcnx->select_db("test"))
		exit("<p>Unable to locate test</p>");
?>