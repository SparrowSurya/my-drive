import React from "react";
import FileUploadProvider from "@/contexts/fileUpload";
import ContentViewProvider from "@/contexts/contentView";
import ModalProvider from "@/contexts/modal";
import PageViewProvider from "@/contexts/pageView";


export default function DriveContextProviders({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <PageViewProvider>
      <FileUploadProvider>
        <ContentViewProvider>
          <ModalProvider>
            { children }
          </ModalProvider>
        </ContentViewProvider>
      </FileUploadProvider>
    </PageViewProvider>
  );
}
