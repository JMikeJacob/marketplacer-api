let _controller = null;
let _repository = null;

const factory = () => {
    const _self = this;

    _self.setController = (controller) => {
        _controller = controller;
    };

    _self.setRepository = (repository) => {
        _repository = repository;
    };

    _self.controller = () => {
        return _controller;
    };

    _self.repository = () => {
        return _repository;
    };

    return _self;
};

module.exports = factory;