import TiptapEditor from "@/components/tiptap-editor/TiptapEditor";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

function PostDetail() {
    const params = useParams();
    const location = useLocation();

    /* TODO: react-router-dom upgrade to v7 */
    
    useEffect(() => {
        console.log('Current Location:', location);
        console.log('Full URL:', window.location.href);
        console.log('Params:', params);
        console.log('ID:', params.id);
    }, [params, location]);

  return (
    <div>
      <TiptapEditor></TiptapEditor>
    </div>
  );
}

export default PostDetail;
