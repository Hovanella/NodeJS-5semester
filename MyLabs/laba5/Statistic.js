class Statistic
{
    
    ssEnabled = false;
    startDate = '';
    finishDate = '-';
    requestsCount = 0;
    commitsCount = 0;
    
    reset()
    {
        this.ssEnabled = true;
        this.startDate = '';
        this.finishDate = '-';
        this.requestsCount = 0;
        this.commitsCount = 0;
    }
};

module.exports = new Statistic();