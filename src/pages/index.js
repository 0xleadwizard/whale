import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [whales, setWhales] = useState([]);
  const [network, setNetwork] = useState('Mainnet');
  const networkToApi ={
    mainnet: 'https://eth.blockscout.com',
    optimism: 'https://optimism.blockscout.com'
  }
  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
  }

  function getWhales(address) {
    if (address == undefined || address == "") {
      return;
    }
    copyToClipboard(address);
    const maxWhales = 5;
    const url = `${networkToApi[network]}/api/v2/tokens/${address}/holders`;
    fetch(url)
      .then((response) => {
        // Check if response is OK
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Parse response as JSON
        response.json().then((data) => {
          let buildWhales = [];
          for (let i = 0; i < Math.min(data.items.length, maxWhales); i++) {
            buildWhales.push({
              address: data.items[i].address.hash,
            });
          }
          console.log(buildWhales);
          setWhales(buildWhales);
        });
      })
      .then((data) => {
        // Data contains the JSON response
        console.log(data);
      })
      .catch((error) => {
        // Handle errors
        console.error("There was a problem with the fetch operation:", error);
      });
  }
  function search() {
    if (searchInput === "") {
      return;
    }
    const url = `${networkToApi[network]}/api/v2/search?q=${searchInput}`;
    fetch(url)
      .then((response) => {
        // Check if response is OK
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Parse response as JSON
        response.json().then((data) => {
          console.log(data);
          let buildSuggestions = [];
          data.items.map((item) => {
            buildSuggestions.push({ name: item.name, address: item.address, icon_url: item.icon_url});
          });
          console.log(buildSuggestions);
          setSuggestions(buildSuggestions);
        });
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);
  };
  const handleNetworkChange = (e) => {
    setNetwork(e.target.value);
  };

  return (
    <main
      className={`flex min-h-screen flex-col justify-between p-24 ${inter.className}`}
    >
      <div className="flex-row">
          <div>
            <label htmlFor="network">Select Network:</label>
            <select id="network" value={network} onChange={handleNetworkChange}>
              <option value="mainnet">Mainnet</option>
              <option value="optimism">Optimism</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-64 p-2 border rounded shadow-md"
            value={searchInput}
            onChange={handleInputChange}
          />
          <button onClick={search}> search </button>
          </div>
      
      <div className="flex flex-row justify-between mt-8">
        
          {suggestions.length !== 0 && (
            <div className="mt-2">
              <table>
                <tbody>
                  <tr>
                    <th> Name </th> 
                    <th> Address </th>
                    <th> Icon </th>
                  </tr>
                  {suggestions.map((suggestion, index) => (
                      <tr key={index} onClick={() => {getWhales(suggestion.address)}}>
                        <td> <img src={suggestion.icon_url}/> </td>
                        <td> {suggestion.name} </td>
                        <td> {suggestion.address} </td>
                        
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      <div className="flex flex-col items-center mt-8">
        { whales.length !== 0 && (
          <div>
          <h1 className="text-2xl font-bold">Whales</h1>
          <div className="mt-2">
            <table>
              <tbody>
                <tr>
                  <th> Address </th>
                </tr>
                {whales.map((whale, index) => (
                    <tr key={index}>
                      <td onClick={() => copyToClipboard(whale.address)}> {whale.address} </td>
                    </tr>
                ))}
              </tbody>
            </table> 
          </div>
          </div>
        )}
      </div>
      </div>

    </main>
  );
}
