import React, { useState } from 'react';
import NoteCard, { AddNoteCard } from './NoteCard';
import { styles } from '@/app/styles';

const Notes = ({ userInfo }: any) => {
  console.log(userInfo);
  const [display, setDisplay] = useState(false);
  const [noteEditingDisplay, setNoteEditingDisplay] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const { data, loadingFirst, error } = {
    data: [
      { id: '1', title: 'title', content: 'content', author: 'author' },
      {
        id: '2',
        title: 'title',
        content:
          'content asdss ssssssssssssss asd asd asd asd asd asd asd asd asd asd asd asd asd asd sad asd asd',
        author: 'author',
      },
      { id: '3', title: 'title', content: 'content', author: 'author' },
    ],
    loadingFirst: false,
    error: false,
  };
  if (loadingFirst)
    return (
      <div className="h-full w-full my-1  rounded-sm text-white bg-gray-700 text-center flex justify-center items-center">
        <p className="text-2xl font-semibold py-4">Loading posts...</p>
      </div>
    );

  if (error)
    return (
      <div className="h-full w-full my-1  rounded-sm text-white bg-gray-700 text-center flex justify-center items-center">
        <p className="text-2xl font-semibold py-4">Failed to Fetch posts...</p>
      </div>
    );
  const toggleDisplay = () => {
    setDisplay(!display);
    setNoteEditingDisplay(false);
  };

  const toggleNoteEditingDisplay = ({ id }: { id: string }) => {
    const note = data.find((item) => item.id === id);

    if (note) {
      const { title, content } = note;
      setNoteTitle(title);
      setNoteContent(content);
      setNoteEditingDisplay(!noteEditingDisplay);
      setDisplay(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Submitted:', title, content);
    setTitle(title);
    setContent(content);
    setDisplay(false);
  };
  const handleEdit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Submitted:', noteTitle, noteContent);
    setNoteTitle(noteTitle);
    setNoteContent(noteContent);
    setNoteEditingDisplay(false);
  };

  return (
    <div
      className={`${styles.padding} relative min-h-screen text-tertiary flex justify-center items-center`}
    >
      <div className={`flex flex-row w-full h-full mt-8 z-10 max-sm:flex-col`}>
        <div className="flex flex-col sm:h-screen w-max overflow-y-auto overflow-x-hidden">
          <div
            onClick={() => toggleDisplay()}
            className={`${display ? 'opacity-100' : 'opacity-70'}`}
          >
            <AddNoteCard />
          </div>
          {data.map((note: any) => (
            <div
              className={`h-min w-[350px]`}
              key={`Notes-${note}`}
              onClick={() => toggleNoteEditingDisplay(note)}
            >
              <NoteCard {...note} index={note} />
            </div>
          ))}
        </div>
        <div className="w-full min-h-screen bg-transparent backdrop-blur-sm flex flex-wrap flex-col justify-center items-center">
          asd
        </div>
      </div>
      <div className="absolute bg-hero-pattern w-full h-full opacity-20 bg-cover bg-no-repeat bg-center"></div>
      {display && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 border rounded-md">
          <div className="bg-black/30 backdrop-blur-3xl h-[500px] w-[300px] border rounded-md">
            <form
              className="h-full flex flex-col justify-center items-center z-10"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="rounded-lg border-2 border-primary bg-tertiary h-12 w-max px-4 text-md focus:outline-inherit m-4 text-primary"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                className="rounded-lg border-2 border-primary bg-tertiary w-max h-32 px-4 py-2 text-md focus:outline-inherit text-primary"
              ></textarea>
              <button
                type="submit"
                className={`${styles.heroSubText} bg-tertiary shadow-md shadow-secondary mt-6 px-2 py-0.5 rounded-md text-primary`}
              >
                Create Note
              </button>
            </form>
            <button
              className="absolute top-2 left-1/2 -translate-x-1/2 text-active font-bold md:text-[24px] border rounded-full p-1 sm:text-[18px] max-sm:text-[18px] text-center"
              onClick={() => toggleDisplay()}
            >
              ❌
            </button>
          </div>
        </div>
      )}
      {noteEditingDisplay && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 border rounded-md">
          <div className="bg-black/30 backdrop-blur-3xl h-[500px] w-[300px] border rounded-md">
            <form
              className="h-full flex flex-col justify-center items-center z-10"
              onSubmit={handleEdit}
            >
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Title"
                className="rounded-lg border-2 border-primary bg-tertiary h-12 w-max px-4 text-md focus:outline-inherit m-4 text-primary"
              />
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Content"
                className="rounded-lg border-2 border-primary bg-tertiary w-max h-32 px-4 py-2 text-md focus:outline-inherit text-primary"
              ></textarea>
              <button
                type="submit"
                className={`${styles.heroSubText} bg-tertiary shadow-md shadow-secondary mt-6 px-2 py-0.5 rounded-md text-primary`}
              >
                Update Note
              </button>
            </form>
            <button
              className="absolute top-2 left-1/2 -translate-x-1/2 text-active font-bold md:text-[24px] border rounded-full p-1 sm:text-[18px] max-sm:text-[18px] text-center"
              onClick={() => setNoteEditingDisplay(false)}
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
