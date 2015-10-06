<?php

$folder = $_GET['folder'];

$photos_list = [];
foreach (glob(__DIR__.'/photos/'.$folder.'/*.small.jpg') as $file) {
    $photos_list[] = str_replace(__DIR__, '', $file);
}
foreach (glob(__DIR__.'/photos/'.$folder.'/*.small.JPG') as $file) {
    $photos_list[] = str_replace(__DIR__, '', $file);
}
foreach (glob(__DIR__.'/photos/'.$folder.'/*.small.jpeg') as $file) {
    $photos_list[] = str_replace(__DIR__, '', $file);
}
foreach (glob(__DIR__.'/photos/'.$folder.'/*.small.JPEG') as $file) {
    $photos_list[] = str_replace(__DIR__, '', $file);
}

$random_count = 8;
if (count($photos_list) <= $random_count) {
    shuffle($photos_list);
    echo json_encode($photos_list);
} else {
    $random_photos = [];

    while (count($random_photos) < $random_count) {
        $some_random_pic = $photos_list[rand(0, count($photos_list) - 1)];
        if (array_search($some_random_pic, $random_photos) === FALSE) {
            $random_photos[] = $some_random_pic;
        }
    }

    echo json_encode($random_photos);
}

