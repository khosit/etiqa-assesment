
import { useState, useEffect } from "react";
import { format } from "date-fns";


function Card() {

    interface Post {
        name: string;
        description: string;
        avatar_url: string;
        full_name: string;
        score: number;
      }

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1); // For pagination

    /*Get API response*/
    const fetchData = async (page:any) => {
        console.log(`Page load : ${page}`);
        const today = new Date();
        const last10day = format(today.setDate(today.getDate() - 10), "yyyy-MM-dd");

        console.log(`Last 10 days date : ${last10day}`);
        setLoading(true);
        const response = await fetch(`https://api.github.com/search/repositories?q=created:>${last10day}&sort=stars&order=desc?page=${page}`);
        const data = await response.json();
        setPosts((prevPosts) => [...prevPosts, ...data.items]);
        setLoading(false);
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    /*Scroll handling*/
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
            return;
        }
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading]);

    const listItems = posts.map(post =>
        <div className="card">
            <h4>{post.name}</h4>
            <p>{post.description}</p>
            <div className="info">
                <div className="owner">
                    <img src={post.owner.avatar_url} alt="avartar image"></img>
                    <p>{post.full_name}</p>
                </div>
                <div className="rate">
                    <p>{post.score}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container">
            {listItems}
        </div>
    );
}

export default Card