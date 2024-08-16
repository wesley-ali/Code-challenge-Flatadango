import React, { useState, useEffect } from 'react';
import BotCollection from './BotCollection';
import BotArmy from './BotArmy';
import BotSpecs from '../components/BotSpecs';
import BotSearch from '../components/BotSearch';
import Filter from '../components/Filter';

const BotPage = () => {
  const [allBots, setAllBots] = useState([]);
  const [selectBot, setSelectBot] = useState(undefined);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('https://json-server-5-zmha.onrender.com/bots')
      .then(res => res.json())
      .then(bots => setAllBots(bots.map(bot => ({ ...bot, owned: false }))));
  }, []);

  const clickBot = (bot) => setSelectBot(bot);

  const addBot = (selectedBot) => {
    setAllBots(allBots.map(bot => (bot.id === selectedBot.id ? { ...bot, owned: !bot.owned } : bot)));
  };

  const filterFreeBots = () => {
    let freeBots = allBots.filter(bot => !bot.owned);
    if (filter !== 'All') {
      freeBots = freeBots.filter(bot => bot.bot_class === filter);
    }
    if (query) {
      freeBots = freeBots.filter(bot => bot.name.toLowerCase().includes(query.toLowerCase()));
    }
    return freeBots;
  };

  const filterOwnedBots = () => {
    let ownedBots = allBots.filter(bot => bot.owned);
    if (filter !== 'All') {
      ownedBots = ownedBots.filter(bot => bot.bot_class === filter);
    }
    if (query) {
      ownedBots = ownedBots.filter(bot => bot.name.toLowerCase().includes(query.toLowerCase()));
    }
    return ownedBots;
  };

  const handleClear = () => setQuery('');

  const handleChange = (query) => setQuery(query);

  const clearSpec = () => setSelectBot(undefined);

  const filterChange = (value) => setFilter(value);

  return (
    <div className="container">
      <BotSearch handleClear={handleClear} handleChange={handleChange} />
      <br />
      <Filter filterChange={filterChange} />
      <BotArmy bots={filterOwnedBots()} addBot={clickBot} />
      <br />
      {selectBot ? (
        <BotSpecs bot={selectBot} clearSpec={clearSpec} addBot={addBot} />
      ) : (
        <BotCollection bots={filterFreeBots()} addBot={clickBot} />
      )}
    </div>
  );
};

export default BotPage;