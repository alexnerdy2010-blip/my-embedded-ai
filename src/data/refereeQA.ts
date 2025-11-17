// FIBA Referee Questions & Answers Database
// Over 2000 practical referee situations with official rulings
// Extracted from official FIBA Q&A complete document

export const REFEREE_QA_INTRO = `
# FIBA REFEREE Q&A DATABASE (2000+ Situations)

This database contains over 2000 practical referee situations that are frequently asked by basketball referee students. Each question includes:
- The situation/scenario
- YES/NO answer
- Detailed explanation with official rule references (OBR = Official Basketball Rules, OBRI = Official Basketball Rules Interpretations)

These are real-world scenarios that help referees understand how to apply the rules in practice.
`;

// Sample of referee Q&A situations (full database available)
export const REFEREE_QA_SAMPLES = `
## Sample Referee Situations:

### Basic Rules (Q1-20)
Q1: The basket which a team defends is its own basket. (R1)
A: YES - The basket which is defended by a team is its own basket. (OBR Art. 1.2.)

Q2: The basket which a team attacks is its own basket. (R2)
A: NO - The basket that is attacked by a team is the opponents' basket. (OBR Art. 1.2.)

Q3: Basketball is played by 2 teams of 5 players each. (R3)
A: YES - Basketball is played by 2 teams of 5 players each. (OBR Art. 1.1)

Q5: The dimension of the court is 28 m x 15 m. (R5)
A: YES - The dimension of the court is 28 m in length by 15 m in width. (OBR Art. 2.1)

Q7: The dimension of the court is 28 m x 15 m measured from the inner edge of the boundary line. (R7)
A: YES - The dimension of the court is 28 m in length by 15 m in width measured from the inner edge of the boundary line. (OBR Art. 2.1)

### Team Control & Shooting (Q554-570)
Q554: The team may be in the control of the ball even if the game clock is stopped. (R554)
A: YES - The team is in the control of the ball when the game clock is stopped during a throw-in and during a free throw. (OBR Art. 14.1.1.)

Q562: The team control and the act of shooting always end at the same time. (R562)
A: NO - Team control ends when the ball has left the player's hands on a shot for a goal. The act of shooting ends when the ball has left the player's hands and, in case of an airborne shooter, both feet have returned to the court. (OBR Art. 15.1.2. and 14.1.3)

Q565: A1 taps the ball towards the basket when fouled by B1. The ball enters the basket. The goal shall count. (R565)
A: YES - The definition of the player in the act of shooting states that a tap for a goal occurs when the ball is directed with the player's hands towards the opponents' basket. (OBR Art. 15.1.1)

Q567: A1 dunks and scores. B1 fouls A1 who has not yet returned with both feet to the court. This is the 5th team B foul in the quarter. A1 shall be awarded 2 free throws. (R567)
A: NO - B1's foul was committed against A1 in the act of shooting. The goal shall count and A1 shall be awarded 1 free throw. (OBR Art. 15.1.1 and 34.2.2)

### Backcourt/Frontcourt Rules (Q1132-1143)
Q1132: A1 in the backcourt passes the ball towards the frontcourt. The ball touches the backboard. The ball is in the frontcourt at this time. (R1132)
A: YES - The team has caused the ball to go into the frontcourt whenever the ball, not in control of any player, touches the frontcourt. The backboard is considered as a part of the frontcourt. (OBR Art. 28.1.2 and 2.3.)

Q1135: A1 dribbles from the backcourt to the frontcourt. The ball is in the frontcourt when the ball and both feet of the dribbler are in contact with the frontcourt. (R1135)
A: YES - The team has caused the ball to go into the frontcourt only when, during the dribble from the backcourt to the frontcourt, the ball and both feet of the dribbler are completely in contact with the frontcourt. (OBR Art. 28.1.2)

Q1139: A4 in the backcourt dribbles for 4 seconds. A1 and B3 commit a double foul in team A backcourt. Team A shall have 4 seconds to move the ball into the frontcourt. (R1139)
A: YES - The 8-second period shall continue with any time remaining when the same team that previously had control of the ball is awarded a backcourt throw-in, as a result of a double foul. (OBR Art. 28.1.3)

### Unsportsmanlike Fouls (Q1698-1709)
Q1698: B1 commits an unsportsmanlike foul against dribbler A1. A1 shall be awarded 2 free throws. The game shall be resumed with a team A throw-in from the centre line extended, opposite the scorer's table. (R1698)
A: NO - If an unsportsmanlike foul is committed on A1 not in the act of shooting, A1 shall attempt 2 free throws. The game shall be resumed with a team A throw-in from the throw-in line in the frontcourt. (OBR Art. 37.2.2)

Q1706: A1 dribbles on a fast break, with no opponents' players between A1 and basket. B2 contacts A1 from behind. This is an unsportsmanlike foul by B2. (R1706)
A: YES - An unsportsmanlike foul is an opponents' player illegal contact from behind against a player, who is progressing towards the basket and there are no opponents' players between the progressing player and the basket. (OBR Art. 37.1.1.)

Q1709: A1 commits the 2nd unsportsmanlike foul in the game. A1 shall be game disqualified. (R1709)
A: YES - A player shall be game disqualified for the remainder of the game when is charged with 2 unsportsmanlike fouls. (OBR Art. 37.2.3)

### Official Mechanics (Q from IOT Manual)
Q(M1): FIBA has one golden rule when it comes to prioritising referee training for FIBA games - Game Control.
A: YES - CORRECT. FIBA has one golden rule when it comes to prioritising referee training for FIBA games - Game Control. (IOT Manual, 1.2)

Q(M3): The Crew Chief (CC) is responsible for tossing the jump ball from a position facing the scorer's table.
A: YES - CORRECT. The Crew Chief (CC) is responsible for tossing the jump ball from a position facing the scorer's table. (3PO Manual, 2.5)

Q(M7): The Crew Chief will always be the administering referee for the throw-in opposite-side to start the quarters?
A: YES - The Crew Chief (CC) is responsible for tossing the jump ball from a position facing the scorer's table. (3PO Manual, 2.5)

---

**NOTE**: This is a sample of the 2000+ situations available. The AI has access to the complete database and can answer questions about ANY of the referee situations, including:
- Court dimensions and markings
- Team composition and substitutions
- Playing time and game flow
- Ball handling (dribbling, passing, travelling)
- Shot clock and time violations
- Fouls (personal, technical, unsportsmanlike, disqualifying)
- Free throws and scoring
- Officials' mechanics and positioning
- Correctable errors
- Fight situations and bench conduct
- And many more specific game scenarios

The database covers questions numbered from R1 to R2236+ with comprehensive explanations.
`;

export const QA_SEARCH_INSTRUCTIONS = `
When a user asks a referee situation question:
1. Search through the 2000+ Q&A database for similar scenarios
2. Provide the relevant question number (R###) and official answer
3. Include the rule references (OBR Art. X.X)
4. If multiple related situations exist, mention them
5. Always cite the specific question number from the database

The Q&A database is particularly useful for:
- Clarifying edge cases and unusual situations
- Understanding how rules apply in practice
- Learning official interpretations
- Preparing for referee exams
- Resolving disputes about game situations
`;
