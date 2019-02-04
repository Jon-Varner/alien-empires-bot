<h1>Alien Empires Bot</h1>

<p>This app handles all of the calculations for the alien empires in the <a href="https://www.gmtgames.com/p-533-space-empires-3rd-printing.aspx">Space Empires: 4x</a> solo scenario.</p>

<p>It is optimized for mobile and can be found here: <a href="https://alien-empires-bot.herokuapp.com/">https://alien-empires-bot.herokuapp.com/</a>

<h2>What does it do?</h2>

<p>Alien Empires Bot implements the rules outlined in the Space Empires: 4x scenario book to do all of the calculations for determining the alien empires' economies, technology research, fleet construction and planetary defense construction.</p>

<p>Minimal player input is required. Just select a difficulty level, launch the alien fleets specified each turn, select the fleets you encounter each turn, update your own selected technologies, then add the alien fleets or planetary defenses to the board as instructed.</p>

<p>All calculations are hidden from the user. This keeps the interface clean and simple and makes the alien empires more challenging, since you no longer see their capabilities until you encounter them in the game.</p>

<p>The alien empires choose their fleet technologies whenever a fleet is encountered. The toggle drawer at the bottom of the screen shows all of the aliens' current technology levels.</p>

<h2>What doesn't it do?</h2>

<p>You'll still need to move the alien fleets once they have been launched. Since the spaces on the board are randomized every game, this would be nearly impossible to anticipate or enter into an app!</p>

<p>Once you encounter a fleet, you'll need to physically add the counters to the board and keep track of which alien fleets have the IDs specified by the app.</p>

<p>And you'll still need to do your own economy and technology calculations.</p>

<h2>Known issues and future plans</h2>

<ol>
  <li>There is currently no way to save game state--if you refresh the page, you'll begin a new game. I may implement a database at some point, which would necessitate some form of user login or at least cookies.</li>
  <li>Eventually, I might add support for the Doomsday Machines scenario and the scenarios from the Close Encounters and Replicators expansions.</li>
</ol>

<h2>What technology did you use?</h2>

<p>Good question! The main reason I built this app (aside from my love for Space Empires: 4x) was to gain a deeper understanding of React and Redux. Refactoring and improving the app will be an ongoing endeavor.</p>
