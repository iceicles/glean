import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as Emoji from 'quill-emoji';
import 'quill-emoji/dist/quill-emoji.css';
import styled from '@emotion/styled';

Quill.register('modules/emoji', Emoji);

const TextEditor = (props) => {
  // var options = {
  //   placeholder: 'Compose an epic...',
  // };

  return (
    <TextEditorDiv>
      <ReactQuill
        theme={props.theme}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        readOnly={props.readOnly}
        modules={{
          toolbar: TOOLBAR_OPTIONS,
          'emoji-toolbar': true,
          'emoji-textarea': false,
          'emoji-shortname': true,
          history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true,
          },
        }}
        style={{ height: 'inherit' }}
      />
    </TextEditorDiv>
  );
};

// toolbar modules
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block', 'link'],
  ['emoji', 'image'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['clean'],
];

/* --- STYLES --- */

const TextEditorDiv = styled('div')({
  height: '85%',
  maxWidth: 'inherit',
});

// toolbar handlers
// const TOOLBAR_OPTIONS_HANDLER = {
//   handlers: {
//     bold: function (value) {
//       if (value) {
//         prompt('Do you want to Bolden?');
//       }
//     },
//   },
// };

export default TextEditor;
