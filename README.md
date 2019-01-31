<h1>Alien Empires Bot</h1>

<p>This app handles all of the calculations for the alien empires in the <a href="https://www.gmtgames.com/p-533-space-empires-3rd-printing.aspx">Space Empires: 4x</a> solo scenario.</p>

<p>It is optimized for mobile and can be found here: <a href="https://alien-empires-bot.herokuapp.com/">https://alien-empires-bot.herokuapp.com/</a>

<h2>What does it do?</h2>

<p>Alien Empires Bot implements the rules outlined in the Space Empires: 4x scenario book to do all of the calculations for determining the alien empires' economies, technology research, fleet construction and (eventually) planetary defense construction.</p>

<p>Minimal player input is required. Just select a difficulty level, launch the alien fleets specified each turn, select the fleets you encounter each turn, update your own selected technologies, then add the alien fleets to the board as instructed.</p>

<p>All calculations are hidden from the user. This keeps the interface clean and simple and makes the alien empires more challenging, since you no longer see their capabilities until you encounter them in the game.</p>

<h2>What doesn't it do?</h2>

<p>You'll still need to move the alien fleets once they have been launched. Since the spaces on the board are randomized every game, this would be nearly impossible to anticipate or enter into an app!</p>

<p>Once you encounter a fleet, you'll need to physically add the counters to the board and keep track of which alien fleets have the IDs specified by the app.</p>

<p>And you'll still need to do your own economy and technology calculations.</p>

<h2>Known issues and future plans</h2>

<ol>
  <li>The app currently tracks the alien empires' defensive capability, but does not provide instructions for constructing those defenses when the player invades their homeworlds.</li>
  <li>Currently, the app only constructs 4 types of fleets: Raiders, Carriers, "Biggest Ships Possible", and "Most Ships Possible". The final type of fleet, "Balanced" is a more complicated algorithm.</li>
  <li>There is currently no way to save game state--if you refresh the page, you'll begin a new game. I may implement a database at some point, which would necessitate some form of user login.</li>
  <li>Eventually, I might add a "verbose" mode that displays all of the "die rolls" and tech assignments. For now, I wanted to keep the experience as clean and simple as possible, so I hid all of that information.</li>
</ol>

<h2>What technology did you use?</h2>

<p>Good question! The main reason I built this app (aside from my love for Space Empires: 4x) was to gain a deeper understanding of React and Redux. Refactoring and improving the app will be an ongoing endeavor.</p>
