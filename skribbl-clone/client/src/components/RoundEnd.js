// src/components/RoundEnd.js
import React, { useState, useEffect } from 'react';
import socket from './Socket'; // Replace with your server URL

function RoundEnd() {
  const [roundEnd, setRoundEnd] = useState(false);
  const [winner, setWinner] = useState();

  useEffect(() => {
    // Listen for updates on round end from the server
    socket.on('roundEnd', (winners) => {
      setRoundEnd(true);
      setWinner(winners);
    });

    socket.on('roundStart',()=>{
      setRoundEnd(false)
    })

    // Cleanup function
    return () => {
      socket.off('roundEnd');
      socket.off('roundStart')
    };
  }, []);

  return (

      roundEnd ? (
        <div>
          <h2>Round Over!</h2>
          {winner && <p>Winner: {winner}</p> }
          {!winner && <p>Draw Match</p>}
        </div>
      ) : <></>

  );
}

export default RoundEnd;
