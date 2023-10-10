import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';

const posts  = new Router();

// postsCtrl
posts.post('/', postsCtrl.write);
posts.get('/', postsCtrl.list);
posts.get('/:id', postsCtrl.read);
posts.delete('/:id', postsCtrl.remove);
posts.patch('/:id', postsCtrl.update);

export default posts;