import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const posts  = new Router();

// postsCtrl
posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);


const post = new Router();
post.get('/', postsCtrl.read);
post.delete('/',checkLoggedIn,postsCtrl.checkOwnPost, postsCtrl.remove);
post.patch('/',checkLoggedIn,postsCtrl.checkOwnPost ,postsCtrl.update);

// 작성자 확인을 위해 checkObjectId에서 getPostById로 변경
// posts.use('/:id', postsCtrl.checkObjectId, post.routes())
posts.use('/:id', postsCtrl.getPostById, post.routes())


export default posts;