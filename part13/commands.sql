create table blogs (
    id serial primary key,
    author text,
    url text not null,
    title text not null,
    likes integer default 0
);

insert into blogs (title, author, url, likes) values ('React patterns', 'Michael Chan', 'https://reactpatterns.com/', 7);
insert into blogs (title, author, url, likes) values ('Go To Statement Considered Harmful', 'Edsger W. Dijkstra', 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', 5);
