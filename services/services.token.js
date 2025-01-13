const model = require('../model/index');

const cleanupExpiredTokens = {
    async expiredTokens(){
        try {
            const expiredTokens = await model.token.findAll({ where: { expire: true } });
    
            if (expiredTokens.length > 0) {
                await Promise.all(expiredTokens.map(async (token) => {
                    await token.destroy();
                }));
            }
        } catch (err) {
            
        }
    }
} 

module.exports = cleanupExpiredTokens;
