// vomiting into the global space
var myApp = angular.module('myApp', []);

function gotoPage( page ) {
    if ( ! page ) {
        page = 'home';
    }

    if ( $('#'+page).length ) {
      $('.page').hide();
      $('#'+page).show();
    }
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function MovieController($scope){
    gotoPage();

    $scope.timer = 0;
    $scope.quote = '';
    $scope.points = 0;
    $scope.lives_count = 10;
    $scope.lives = '';
	$scope.lives_lost = '';
    
    $scope.movies = MOVIES;
    
    $scope.movies_in_trivia = [];
    $scope.startTrivia = function(){
        _selectMovies();
        _getQuote();
        _drawLives( $scope.lives_count );
        $scope.timer = Math.round(new Date().getTime() / 1000);
    }
        
    $scope.doSomething = function(){
    alert('aaa');
    }

    $scope.letsPlay = function() {
        $scope.points = 0;
        $scope.lives_count = 10;
        $scope.startTrivia();

        gotoPage( 'game' );
    }

    $scope.sendAnswer = function(){
        var quote_id = this.quote.id;
        var movie_id = this.movie.id;
        
        // only proceed if we have both
        if( quote_id && movie_id )
        {
            // let's see if we have this movie (we most likely will)
            var movie = _.detect($scope.movies_in_trivia, function (obj) {return obj.id === movie_id});
            if( movie )
            {
                // now let's check if we have this specific quote here
                var quote = _.detect(movie.quotes, function (obj) {return obj.id === quote_id});
               
                // if we do, the answer is correct
                if( quote ){
                    // we only care about the time if the answer was good
                    var answered_in = Math.round(new Date().getTime() / 1000) - $scope.timer;
                    if( answered_in < 16 )
                    {
                        console.log('meh?');
                        console.log( 'points: ',  $scope.points );
                        $scope.points += 15 - answered_in;
                                                console.log( 'points: ',  $scope.points );
                    }
                    console.log('OK!');
                }
                else{
                    $scope.lives_count--;
                    if( $scope.lives_count < 1 )
                    {
                        gotoPage( 'game-over' );
                    }
                }

                console.log( 'movie ID: ' + movie_id, 'quote ID: ' + quote_id );      
                $scope.startTrivia();
            }
                                           
        }
    }
        
                                     
    var _drawLives = function(num){
        if( num )
        {
          var hearts = '';
          for( i=0; i<num; i++ )
          {
            hearts += '♥';
          }
		  // TODO this is gettho, i tried to simply render HTML in a view and it didn't work
		  // loook at angular sanitize and HTML binding
		  var hearts_dark = '';
		  for( i=0; i<10-num; i++ ) {
            hearts_dark += '♥';
		  }

          $scope.lives = hearts;
		  $scope.lives_lost = hearts_dark;
        }
    }
                    
    var _selectMovies = function(){
        var movies = $scope.movies.slice(0, $scope.movies.length),
            movie;
        $scope.movies_in_trivia = [];
                
        for(var i=0;i<3;i++){
            movies.sort(function() {return 0.5 - Math.random()}); // randomly pick a movie
            movie = movies.shift();
            if ( movie ) {
                $scope.movies_in_trivia.push( movie ); // fill up the trivia
            }
        }
    }
                        
    var _getQuote = function(){
        var movies = $scope.movies_in_trivia,
            random_movie_pos = null,
            movie_cnt = movies.length;
        $scope.quote = '';
        
        if( movie_cnt )
        {
            random_movie_pos = Math.floor( Math.random() * movie_cnt );
               
            // it can be 0
            if( random_movie_pos != null )
            {
                var random_movie = movies[random_movie_pos];
                if( random_movie && random_movie.quotes.length )
                {
                    $scope.quote = random_movie.quotes[ Math.floor(Math.random()* random_movie.quotes.length ) ];
                }
            }
        }
    }
        
    $scope.startTrivia();
}

function GameController($scope){
    // TODO move this to the draw(), we don't need it here
    $scope.cards = [1,2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
    $scope.card_types = ["♠", "♣", "♦", "♥"];
    $scope.cash = 500;
    $scope.wager = 50;
    $scope.cards_drawn = [];
    
    $scope.pointsa = 0;
    
    $scope.plusPlus = function(){
        $scope.points++;
    }
        
        
    $scope.isRed = function( card ){
        if( card && ( card.indexOf( '♦' ) > -1 || card.indexOf( '♥' ) > -1 ) )
        {
            return 'red';
        }        
    }
        
    $scope.draw = function(){
                return;
        var btn_draw = $('.btn-draw');
    
        if( ! _isGameOver( $scope.points ) )
        {
            if( btn_draw.text() != 'Draw!' ){
                btn_draw.text( 'Draw!' );
            }
            
            var rand_card = Math.floor((Math.random()*$scope.cards.length));
            var rand_type = Math.floor((Math.random()*$scope.card_types.length));
            var value = 0;
    
            if( isNumber($scope.cards[rand_card]) )
            {
                $scope.points += $scope.cards[rand_card];
            }
            else
            {
                $scope.points += 10;
            }
    
            $scope.cards_drawn.push( $scope.cards[rand_card] + " " +  $scope.card_types[ rand_type ] );
            if( _isGameOver( $scope.points ) )
            {
                $('.btn-draw').text( 'Start again!' );
            }                            
        }
        else{
            $scope.cash -= $scope.wager;
            _startNewGame();            
        }   
    }

    $scope.cashIn = function()
    {
        var earned = $scope.points/21*$scope.wager;
        if( $scope.points == 21 )
        {
            earned *= 2;
        }
        else
        {
            earned /= 2;
        }

        $scope.cash += Math.round(earned);
        _startNewGame();            
    }
        
    var _isGameOver = function( points )
    {
        if( points > 21 ){        
            return true;
        }
        
        return false;
    }
        
    var _startNewGame = function()
    {
        $scope.points = 0;
        $scope.cards_drawn = [];
        $scope.draw();        
    }
        
    $scope.draw();
}; 
