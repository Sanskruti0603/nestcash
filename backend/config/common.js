const generateAccountNumber = () => {
  const timestampPart = Date.now().toString().slice(-6); 
  const randomPart = Math.floor(1000 + Math.random() * 9000); 
  return timestampPart + randomPart; 
};

module.exports = {
  generateAccountNumber,
};
