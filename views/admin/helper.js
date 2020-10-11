module.exports = {
    getError(errors) {
        try {
            return errors.filter((item) => {
                return item.value !== '';
            })[0].msg;
        } catch (error) {
            return '';
        }
    }
};