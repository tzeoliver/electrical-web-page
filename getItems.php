<?php 
$handle = @fopen("tavarat.txt", "r");
$arr = array();
if ($handle) {
    while (($buffer = fgets($handle, 4096)) !== false) {
        $buffer = explode("," , $buffer);
        $arr[$buffer[0]] = str_replace(array("\n", "\r"), "", array($buffer[1],0,$buffer[2]));
    }
    if (!feof($handle)) {
        echo "Error: unexpected fgets() fail\n";
    }
    
    echo json_encode($arr,JSON_UNESCAPED_UNICODE);
    fclose($handle);
}

?>