module.exports = function (app) {

    var Task = require('../../models/task');
    var User = require('../../models/user');

    app.get('/api/users/:userId', function (req, res) {
        console.log(req.params)
        //User.findOne({_id: req.params.userId}, '-local.passwordHashed -local.passwordSalt', function (user) {
        //
        //    console.log(user);
        //    console.log('params', req.params);
        //
        //    res.json(user);
        //});
    });

    app.get('/api/users/:userId/tasks', function (req, res, next) {

        var q = {
            $and: [
                {developer: req.user},
                {
                    $and: [
                        {
                            status: {$ne: 'accepted'},
                        },
                        {
                            archived: {$ne: true}
                        }
                    ]
                }

            ]
        };
        Task.find(q)
            .sort('-updatedAt')
            .populate('owner', '-local.passwordHashed -local.passwordSalt')
            .populate('developer', '-local.passwordHashed -local.passwordSalt')
            .exec(function (err, tasks) {
                if (err) return next(err);
                res.json(tasks);
            });
    });


};
