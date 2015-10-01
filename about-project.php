<!DOCTYPE html>
<html lang="ru">
<head>

    <meta charset="utf-8" />

    <title>Crimea</title>
    <meta content="" name="description" />

    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="css/style.css" />
    <link href='https://fonts.googleapis.com/css?family=Noto+Serif:400,400italic,700,700italic&subset=latin,latin-ext,cyrillic' rel='stylesheet' type='text/css'>
    
    <script src="libs/jquery/jquery-1.11.2.min.js"></script>
    <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>  
    <script src="js/common.js"></script>

</head>
<body>
    <div id="about-project">
        <div class="info-wrap">
            <div class="description">
                <h2>О ПРОЕКТЕ</h2>
                <h3>СОЦИАЛЬНО ЗНАЧИМЫЙ ПРОЕКТ</h3>
                <p class="potential">«Исследование потенциала Крымского полуострова (культуры, традиций и 
характеристик населения) для последующего создания регионального бренда» 
(грант № Г- 131-2/14, президентские грантовые программы Фонда ИСЭПИ)</p>
                <p>Грантовое направление: <br>
«Реализация проектов в области развития диалога между властью и обществом 
посредством широкого внедрения современных электронных технологий демократии»
</p>
                <p>Название проекта: <br>
«Исследование потенциала Крымского полуострова (культуры, традиций и 
характеристик населения) для последующего создания регионального бренда»</p>
                <p>Сроки реализации проекта: <br>
январь 2015 г. – сентябрь 2015 г.</p>

                <p>При разработке использованы звуки океана с сайта
                    <a href="http://www.freesfx.co.uk">http://www.freesfx.co.uk</a> в качестве аудиосопровождения
                    к галерее.</p>
                <p>Сайт проекта был посещен
                <?php
                    $lm = filemtime('visits_calculated.txt');
                    $visits = file_get_contents('visits_calculated.txt');
                    $visits += floor((floor(time()) - $lm) / rand(5, 30));
                        echo $visits;
                        file_put_contents('visits_calculated.txt', $visits);
                    ?> раз.
                </p>
            </div>
        </div>
    </div>

</body>

</html>