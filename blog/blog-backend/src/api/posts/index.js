import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';

const posts  = new Router();

// postsCtrl
posts.post('/', postsCtrl.write);
posts.get('/', postsCtrl.list);


const post = new Router();
post.get('/', postsCtrl.read);
post.delete('/', postsCtrl.remove);
post.patch('/', postsCtrl.update);

posts.use('/:id', postsCtrl.checkObjectId, post.routes())

export default posts;