package com.amyas.sort;

public class BubbleSort3<E extends Comparable<E>> extends Sort<E> {
  @Override
  protected void sort() {
    for (int end = array.length - 1; end > 0; end--) {
      int sortedIndex = 1;
      for (int begin = 1; begin <= end; begin++) {
        if (cmp(begin, begin - 1) < 0) {
          swap(begin, begin - 1);
          sortedIndex = begin;
        }
      }
      end = sortedIndex;
    }
  }
}
