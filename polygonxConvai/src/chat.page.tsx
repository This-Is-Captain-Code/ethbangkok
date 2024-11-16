import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const Chatpage = () => {
    const {id} = useParams();
    const [character, setCharacter] = useState({} as any);
    const [sessions, setSessions] = useState({} as any)

    const getCharacter = async (charID: string) => {
        const url = "https://api.convai.com/character/get";
        const apiKey = ""; // Replace with your actual API key
      
        const headers = {
          "CONVAI-API-KEY": import.meta.env.VITE_CONVAI_API_KEY,
          "Content-Type": "application/json",
        };
      
        const requestBody = {
          charID: charID,
        };
      
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(requestBody),
          });
      
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
      
          const data = await response.json();
          console.log("Character data:", data);
          setCharacter(data)
          return data;
        } catch (error) {
          console.error("Error fetching character:", error);
          return null;
        }
      };

      const chatHistoryInSessions = async (charId: string) => {
        const url = "https://api.convai.com/character/chatHistory/list"
        const headers = {
            "CONVAI-API-KEY": import.meta.env.VITE_CONVAI_API_KEY,
            "Content-Type": "application/json",
          };
        
          const requestBody = {
            charID: charId,
          };
        
          try {
            const response = await fetch(url, {
              method: "POST",
              headers: headers,
              body: JSON.stringify(requestBody),
            });
        
            if (!response.ok) {
              throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
        
            const data = await response.json();
            console.log("Sessions data:", data);
            setSessions(data)
            return data;
          } catch (error) {
            console.error("Error fetching character:", error);
            return null;
          }
      }

    useEffect(() => {
        if (id) getCharacter(id)
        if (id) chatHistoryInSessions(id)
    }, [id])
  return (
    <div>
        <div style={{background: '#EEEEEE', padding: '10px', borderRadius: '5px'}}>
            {character.character_name}
        </div>
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}
        >
            {
                sessions && sessions.length > 0 ? <>
                    {sessions.map((session: any, _idx: number) => {
                        return(
                            <div key={_idx} style={{background: '#D2D2D2', padding: '10px', borderRadius: '5px'}}>
                                {session.sessionID}
                            </div>
                        )
                    })}
                </> : <></>
            }
        </div>
        
    </div>
  )
}

export default Chatpage